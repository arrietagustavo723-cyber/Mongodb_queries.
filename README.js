// ===============================================
//   BASE DE DATOS: tienda_online
//   COLECCIONES: productos, usuarios, ordenes
// ===============================================

use tienda_online;

// ===============================================
// 1. INSERCIÓN MASIVA — 100 DOCUMENTOS POR COLECCIÓN
// ===============================================

// ----------- Productos (100 documentos) -----------
for (let i = 1; i <= 100; i++) {
  db.productos.insertOne({
    nombre: "Producto " + i,
    precio: Math.floor(Math.random() * 200) + 10,
    categoria: ["Tecnología", "Ropa", "Hogar", "Deportes"][Math.floor(Math.random() * 4)],
    stock: Math.floor(Math.random() * 50) + 1
  });
}

// ----------- Usuarios (100 documentos) -----------
for (let i = 1; i <= 100; i++) {
  db.usuarios.insertOne({
    nombre: "Usuario " + i,
    correo: "usuario" + i + "@correo.com",
    edad: Math.floor(Math.random() * 40) + 18,
    pais: ["Colombia", "México", "Perú", "Chile", "Argentina"][Math.floor(Math.random() * 5)]
  });
}

// ----------- Órdenes (100 documentos) -----------
for (let i = 1; i <= 100; i++) {
  db.ordenes.insertOne({
    usuario_id: i,
    producto_id: Math.floor(Math.random() * 100) + 1,
    cantidad: Math.floor(Math.random() * 5) + 1,
    fecha: new Date(),
    total: Math.floor(Math.random() * 300) + 20
  });
}

// ===============================================
// 2. CONSULTAS BÁSICAS
// ===============================================

// Insertar un nuevo producto
db.productos.insertOne({
  nombre: "Teclado Gamer",
  precio: 150,
  categoria: "Tecnología",
  stock: 25
});

// Seleccionar todos los usuarios
db.usuarios.find();

// Actualizar stock de un producto
db.productos.updateOne(
  { nombre: "Producto 10" },
  { $set: { stock: 99 } }
);

// Eliminar una orden por ID
db.ordenes.deleteOne({ usuario_id: 5 });

// ===============================================
// 3. CONSULTAS CON FILTROS Y OPERADORES
// ===============================================

// Productos con precio mayor a 100
db.productos.find({ precio: { $gt: 100 } });

// Usuarios de Colombia mayores de 25 años
db.usuarios.find({
  pais: "Colombia",
  edad: { $gt: 25 }
});

// Órdenes con cantidad entre 2 y 4
db.ordenes.find({
  cantidad: { $gte: 2, $lte: 4 }
});

// ===============================================
// 4. CONSULTAS DE AGREGACIÓN
// ===============================================

// Total de productos por categoría
db.productos.aggregate([
  { $group: { _id: "$categoria", total: { $sum: 1 } } }
]);

// Promedio de edad por país
db.usuarios.aggregate([
  { $group: { _id: "$pais", promedio_edad: { $avg: "$edad" } } }
]);

// Total vendido por usuario
db.ordenes.aggregate([
  { $group: { _id: "$usuario_id", total_vendido: { $sum: "$total" } } }
]);

// Productos con stock bajo (menos de 10)
db.productos.aggregate([
  { $match: { stock: { $lt: 10 } } },
  { $sort: { stock: 1 } }
]);
