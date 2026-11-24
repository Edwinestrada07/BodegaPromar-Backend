# AGENTS.md — Bodega PROMAR

Este archivo define las instrucciones para asistentes de programación y
agentes de código que trabajen en el proyecto **Bodega PROMAR**, un
sistema de inventario y organización de materiales de melamina.

## 1. Objetivo del proyecto

Desarrollar un sistema para controlar los materiales almacenados en la
bodega, sus ubicaciones, existencias, reservas y movimientos. El sistema
debe permitir registrar entradas, traslados entre ubicaciones, salidas
hacia máquinas de corte y retornos posteriores al proceso de corte.

Prioriza la integridad del inventario, la trazabilidad de cada operación
y una implementación sencilla de mantener.

## 2. Tecnologías

El backend trabaja con:

- Node.js.
- JavaScript con CommonJS.
- Express 5.
- PostgreSQL.
- Sequelize ORM versión 6.
- Sequelize CLI.

Antes de ejecutar comandos o modificar dependencias, revisa
`package.json`, `src/config/config.js`, `src/config/database.js` y la
estructura real del repositorio. No supongas que existen scripts, paquetes
o herramientas que no estén declarados.

Los scripts conocidos son:

```bash
npm run dev
npm start
npm run sequelize
```

No hay scripts de pruebas automatizadas declarados en el proyecto. La
aplicación se ha ejecutado localmente en `http://localhost:3000`. No fijes
puertos ni credenciales en el código; usa variables de entorno.

## 3. Arquitectura y organización del código

Respeta la arquitectura por capas existente:

```text
Routes → Controller → Service → Repository → Model → PostgreSQL
```

Responsabilidades:

- **Routes:** declaran los endpoints y conectan las rutas con sus
  controladores.
- **Controllers:** reciben la petición HTTP, llaman al servicio y
  construyen la respuesta.
- **Services:** implementan las reglas del negocio, validaciones y
  transacciones.
- **Repositories:** concentran las consultas y operaciones de
  persistencia con Sequelize.
- **Models:** definen las entidades, atributos, tablas y asociaciones.
- **Migrations:** mantienen la estructura de la base de datos versionada.
- **Seeders:** insertan datos iniciales o de referencia cuando
  corresponda.

No coloques reglas de negocio complejas en controladores ni consultas
SQL/Sequelize directamente en las rutas. No dupliques lógica entre capas.

Antes de crear un archivo o una entidad, inspecciona los existentes y
reutiliza los patrones del proyecto. Mantén los nombres, alias de
asociaciones y convenciones actuales, salvo que exista una razón técnica
clara para cambiarlos.

## 4. Reglas fundamentales del inventario

### 4.1 Materiales

Un material puede tener, según el modelo actual:

- Tipo de material.
- Color.
- Textura.
- Espesor en milímetros.
- Largo y ancho.
- Fecha de compra.
- Estado.
- Cantidad.

La cantidad se expresa en **planchas/unidades**, no en metros cuadrados
ni en volumen.

Los estados funcionales contemplados son:

- `NUEVO`
- `SOBRANTE`
- `DAÑADO`

No cambies los nombres de enums ni los atributos de los modelos sin
revisar primero sus migraciones y el impacto en los datos existentes.

### 4.2 Ubicaciones de bodega

La jerarquía física es:

```text
Zona → Estante → Nivel
```

Un nivel puede almacenar cualquier tipo de material. No debe existir una
restricción que haga exclusivo un nivel por tipo, color, espesor,
dimensiones o material.

Las descripciones de zonas, estantes y niveles deben ser generales. No
implementes validaciones de compatibilidad material-nivel.

### 4.3 Inventario y reservas

La tabla `inventarios` registra las existencias por combinación de
material y nivel.

Reglas conocidas:

- La combinación `(material_id, nivel_id)` es única.
- `cantidad` representa las unidades físicas presentes en esa ubicación.
- `cantidad_reservada` representa unidades físicas comprometidas para una
  operación.
- La cantidad disponible se calcula así:

```js
cantidad_disponible = cantidad - cantidad_reservada;
```

- Las reservas no se descuentan de `cantidad`.
- Nunca permitas que una operación utilice más unidades que las
  disponibles.
- Valida que las cantidades sean enteros seguros y positivos cuando se
  trate de entradas, traslados, salidas o retornos.
- Evita cantidades negativas y conserva la integridad de las reservas.

El inventario físico total incluye las unidades reservadas. Para reportes,
distingue claramente entre cantidad física, reservada y disponible.

Cada reserva nueva debe conservar su propio registro asociado al inventario
de material y nivel. Debe ser posible liberar una parte o todo el saldo
pendiente, cancelar el saldo pendiente o consumirlo. La cancelación libera
las unidades pendientes; no descuenta existencias físicas.

### 4.4 Máquinas de corte

Existen cuatro máquinas identificadas exactamente como:

- `SECC 1`
- `SECC 2`
- `SECC 3`
- `SECC 4`

Una salida hacia corte debe identificar la máquina receptora y registrar
el material, cantidad, ubicación de origen, usuario y observación cuando
corresponda.

El consumo de unidades reservadas que se envían a una máquina SECC reduce
la cantidad física y reservada en una sola transacción y registra un
movimiento `SALIDA_SECC`.

No trates una máquina como si fuera un nivel de bodega. El modelo
`Inventario` requiere un `nivel_id`; no crees inventarios ficticios para
máquinas. Si se necesita controlar existencias en proceso o asociar
retornos con una salida específica, diseña una entidad o relación
adecuada después de revisar los modelos existentes.

## 5. Movimientos de inventario y trazabilidad

La tabla `movimientos_inventario` mantiene el historial de operaciones.
Los tipos definidos en el proyecto son:

- `ENTRADA`
- `TRASLADO`
- `SALIDA_SECC`
- `RETORNO_SECC`
- `AJUSTE_POSITIVO`
- `AJUSTE_NEGATIVO`

El historial es **inmutable desde la API ordinaria**:

- Se permite consultar el historial y consultar un movimiento por ID.
- No agregues endpoints genéricos para crear, editar o eliminar movimientos
  manualmente.
- Los movimientos se crean automáticamente como parte de las operaciones
  de negocio correspondientes.

Cada operación que modifique existencias debe generar su movimiento dentro
de la misma transacción de base de datos. Si falla la actualización del
inventario o la creación del movimiento, debe revertirse toda la operación.

El código de movimiento sigue el patrón existente `MOV-XXXXXXXX`, usando
los primeros ocho caracteres de un UUID en mayúsculas. Revisa la
implementación actual antes de modificarlo.

No borres ni alteres movimientos históricos para corregir existencias.
Usa operaciones de ajuste trazables.

## 6. Reglas para operaciones de inventario

### Entrada

- Requiere material, nivel de destino y cantidad.
- Verifica que material y nivel existan.
- Respeta el estado del nivel según las reglas ya implementadas.
- Si ya existe inventario para ese material y nivel, incrementa la
  cantidad del registro existente.
- Si no existe, crea el registro.
- Registra un movimiento `ENTRADA`.

### Traslado

- Requiere material, nivel de origen, nivel de destino y cantidad.
- Origen y destino deben ser diferentes.
- Ambos niveles deben existir y estar activos.
- Debe existir inventario activo en el origen.
- La cantidad trasladada no puede superar la cantidad disponible del
  origen.
- Reduce la cantidad física del origen y aumenta la del destino.
- Si ya existe inventario del material en el destino, incrementa ese
  registro; no crees duplicados.
- Si no existe, crea el registro de destino.
- Las reservas del origen no se trasladan automáticamente ni se
  descuentan.
- El total físico global del material debe conservarse.
- Registra un movimiento `TRASLADO` con origen y destino.

### Salida y retorno de corte

Al implementar estas operaciones, respeta el flujo real:

1. Bodega envía una cantidad de planchas a una máquina `SECC`.
2. La salida reduce las existencias de la ubicación de origen.
3. Después del corte, las planchas completas que regresen se reincorporan
   al inventario.
4. Los retales reutilizables se registran como materiales sobrantes, con
   sus propias dimensiones y ubicación.
5. El material dañado debe poder identificarse sin confundirlo con un
   sobrante reutilizable.

No implementes retornos que no puedan asociarse de forma coherente con la
salida correspondiente cuando esa trazabilidad sea necesaria. Antes de
diseñar esa asociación, inspecciona los modelos, migraciones y flujo actual
y explica las alternativas.

## 7. Transacciones, concurrencia e integridad

Toda operación que modifique inventario y cree movimientos debe usar
transacciones Sequelize.

- Usa la misma transacción en todas las consultas y escrituras que formen
  parte de la operación.
- Bloquea las filas existentes cuando sea necesario para evitar que dos
  operaciones simultáneas consuman las mismas unidades.
- Respeta las restricciones únicas de la base de datos.
- Considera explícitamente la concurrencia cuando todavía no existe una
  fila de inventario: bloquear una fila inexistente no evita por sí solo
  que dos solicitudes intenten insertarla simultáneamente.
- No afirmes que una operación es segura ante concurrencia si no se ha
  resuelto el caso de inserción simultánea.
- Ante un error, ejecuta rollback y propaga un mensaje útil sin ocultar la
  causa técnica en los registros del servidor.

No uses `sequelize.sync({ alter: true })` como sustituto de migraciones en
una base de datos con información que deba conservarse.

## 8. Validaciones y respuestas HTTP

Mantén un formato de respuesta consistente con los controladores
existentes:

```json
{
  "success": true,
  "message": "Operación realizada correctamente",
  "data": {}
}
```

Para errores:

```json
{
  "success": false,
  "message": "Descripción clara del error"
}
```

Valida entradas en el servicio y, si el proyecto ya tiene middleware de
validación, úsalo también en la ruta. No confíes en que el frontend o
Postman enviarán datos correctos.

Diferencia errores de validación, recursos inexistentes y errores
inesperados. No devuelvas siempre `500` ni expongas credenciales, tokens,
consultas sensibles o trazas internas al cliente.

Conserva la convención de autenticación existente. En el código conocido,
los controladores obtienen el identificador mediante
`req.usuario?.id`; no lo cambies a `req.user` sin revisar el middleware
de autenticación.

## 9. Pruebas y forma de trabajo

El proyecto se ha probado manualmente con Postman. Para cada operación
nueva o modificada:

1. Revisa la ruta, controlador, servicio, repositorio, modelo y migraciones
   involucradas.
2. Explica brevemente qué archivos cambiarás y por qué.
3. Implementa un cambio pequeño y coherente.
4. Comprueba la sintaxis y ejecuta las pruebas o scripts que realmente
   existan en `package.json`.
5. Prueba el caso exitoso con Postman.
6. Prueba datos inválidos y recursos inexistentes.
7. Prueba límites de disponibilidad y confirma que un error no modifica
   las existencias.
8. Consulta el inventario y el historial de movimientos para comprobar
   que ambos coinciden.

Para traslados, incluye al menos estas pruebas:

- Trasladar más unidades que las disponibles: debe rechazarse y no
  modificar inventario ni historial.
- Trasladar al mismo nivel de origen: debe rechazarse.
- Trasladar a un nivel donde ya existe el material: debe incrementar el
  registro existente sin duplicarlo.
- Traslado válido: el total físico global debe mantenerse.

No declares una funcionalidad terminada solo porque el endpoint responde
`200` o `201`; verifica también los datos persistidos.

## 10. Seguridad y configuración

- No escribas contraseñas, tokens, claves privadas ni credenciales de
  PostgreSQL directamente en el código.
- Usa variables de entorno y conserva los archivos de ejemplo sin secretos.
- No incluyas archivos `.env` reales en commits.
- No desactives autenticación o autorización para facilitar pruebas sin
  autorización explícita.
- No agregues dependencias sin explicar su necesidad y revisar
  compatibilidad con las versiones instaladas.
- No elimines middleware, rutas, modelos o migraciones existentes sin
  analizar sus dependencias.

## 11. Estilo de código

- Usa JavaScript y CommonJS, que es el sistema de módulos actual del
  proyecto.
- Mantén nombres descriptivos en español, de acuerdo con las convenciones
  actuales.
- Usa `async/await` para operaciones asíncronas.
- Evita duplicar consultas y reglas de negocio.
- Maneja errores de forma explícita.
- No introduzcas abstracciones, patrones o dependencias innecesarias.
- No reformatees archivos completos si el cambio solicitado es pequeño.

## 12. Alcance funcional previsto

Entre las funcionalidades contempladas para el sistema están:

- Catálogos de tipos de material, colores y texturas.
- Gestión de materiales e inventarios.
- Organización por zonas, estantes y niveles.
- Historial de movimientos.
- Máquinas de corte y flujo de salida/retorno.
- Proyectos y órdenes de corte.
- Registro de retales reutilizables y materiales dañados.
- Roles de Administrador, Supervisor y Operario.
- Alertas de bajo inventario: material con menos de 5 unidades.
- En fases posteriores: compras, códigos QR, estadísticas y dashboard.

Los proyectos y órdenes de corte siguen el flujo conceptual:

```text
Proyecto → Orden de corte → Uso de materiales → Producción → Entrega
```

No adelantes módulos futuros ni inventes sus tablas o endpoints si la
tarea actual no los requiere.

## 13. Instrucción principal para el agente

Trabaja de manera incremental y conservadora. Antes de modificar código,
inspecciona los archivos reales y sus relaciones. Explica los cambios,
conserva las reglas de negocio descritas aquí y evita asumir que una
funcionalidad existe solo porque aparece en este documento.

Si una decisión afecta el modelo de datos, la trazabilidad o el
comportamiento del inventario y no está definida, detente y pregunta antes
de implementarla. La prioridad es que las existencias físicas, las reservas
y el historial siempre sean coherentes.
