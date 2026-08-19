/** Este archivo contiene la definición de las relaciones entre los modelos "Role", "User", "Zona", "Estante" y 
    "Nivel" utilizando Sequelize. Estas relaciones permiten establecer asociaciones entre las tablas correspondi-
    entes en la base de datos, facilitando la consulta y manipulación de los datos relacionados.
**/

const Role = require('./Role');
const User = require('./User');

const Zona = require('./Zona');
const Estante = require('./Estante');
const Nivel = require('./Nivel');
const TipoMaterial = require('./TipoMaterial');
const Color = require('./Color');
const Textura = require('./Textura');
const Material = require('./Material');
const Inventario = require('./Inventario');
const MaquinaCorte = require('./MaquinaCorte');

// Un rol puede tener muchos usuarios (SEGURIDAD)
Role.hasMany(User, {
    foreignKey: 'rol_id',
    as: 'usuarios',
});

// Un usuario pertenece a un rol
User.belongsTo(Role, {
    foreignKey: 'rol_id',
    as: 'rol',
});

// Una zona puede tener muchos estantes (ORGANIZACION FISICA)
Zona.hasMany(Estante, {
    foreignKey: 'zona_id',
    as: 'estantes',
});

// Un estante pertenece a una zona
Estante.belongsTo(Zona, {
    foreignKey: 'zona_id',
    as: 'zona',
});

// Un estante puede tener muchos niveles (ORGANIZACION FISICA)
Estante.hasMany(Nivel, {
    foreignKey: 'estante_id',
    as: 'niveles',
});

// Un nivel pertenece a un estante
Nivel.belongsTo(Estante, {
    foreignKey: 'estante_id',
    as: 'estante',
});

// Un color puede tener muchos materiales (GESTION DE MATERIALES)
Color.hasMany(Material, {
    foreignKey: 'color_id',
    as: 'materiales',
});

// Un material pertenece a un color
Material.belongsTo(Color, {
    foreignKey: 'color_id',
    as: 'color',
});

// Una textura puede tener muchos materiales (GESTION DE MATERIALES)
Textura.hasMany(Material, {
    foreignKey: 'textura_id',
    as: 'materiales',
});

// Un material pertenece a una textura
Material.belongsTo(Textura, {
    foreignKey: 'textura_id',
    as: 'textura',
});

// Un tipo de material puede tener muchos materiales (GESTION DE MATERIALES)
TipoMaterial.hasMany(Material, {
    foreignKey: 'tipo_material_id',
    as: 'materiales',
});

// Un material pertenece a un tipo de material
Material.belongsTo(TipoMaterial, {
    foreignKey: 'tipo_material_id',
    as: 'tipoMaterial',
});


// Un material puede tener muchos inventarios (GESTION DE INVENTARIOS)
Material.hasMany(
    Inventario,
    {
        foreignKey: 'material_id',
        as: 'inventarios',
    }
);

// Un inventario pertenece a un material
Inventario.belongsTo(
    Material,
    {
        foreignKey: 'material_id',
        as: 'material',
    }
);

// Un nivel puede tener muchos inventarios (GESTION DE INVENTARIOS)
Nivel.hasMany(
    Inventario,
    {
        foreignKey: 'nivel_id',
        as: 'inventarios',
    }
);

// Un inventario pertenece a un nivel
Inventario.belongsTo(
    Nivel,
    {
        foreignKey: 'nivel_id',
        as: 'nivel',
    }
);
        
const db = {
    Role,
    User,
    Zona,
    Estante,
    Nivel,
    TipoMaterial,
    Color,
    Textura,
    Material,
    Inventario,
    MaquinaCorte
};

module.exports = db;