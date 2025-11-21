// =======================================
//   BASE DE DATOS: tienda_online
//   COLECCIONES: productos, usuarios, ordenes
// =======================================

// ================================================
// 1. INSERCIÓN MASIVA — 100 DOCUMENTOS POR COLECCIÓN
// =================================================

// ----------- Productos (100 documentos) -----------
for (let i = 1; i <= 100; i++) {
  db.productos.insertOne({
    nombre: "Producto " + i,
    precio: Math.floor(Math.random() * 200) + 10,
    categoria: ["Tecnología", "Ropa", "Hogar", "Deportes"][Math.floor(Math.random() * 4)],
    stock: Math.floor(Math.random() * 50) + 1
  });
}

// ----------- Usuarios (100 documentos) ----------------
for (let i = 1; i <= 100; i++) {
  db.usuarios.insertOne({
    nombre: "Usuario " + i,
    email: "usuario" + i + "@correo.com",
    pais: ["Colombia", "México", "Chile", "Perú", "Argentina"][Math.floor(Math.random() * 5)],
    edad: Math.floor(Math.random() * 50) + 18
  });
}

// ----------- Órdenes (100 documentos) ----------------
for (let i = 1; i <= 100; i++) {
  db.ordenes.insertOne({
    usuario_id: i,
    productos: [
      { nombre: "Producto " + Math.floor(Math.random() * 100), cantidad: Math.floor(Math.random() * 5) + 1 }
    ],
    total: Math.floor(Math.random() * 300) + 20,
    fecha: new Date()
  });
}


// ===============================
// 2. CONSULTAS BÁSICAS CRUD
// ===============================

// ----- Inserción de un documento -----
db.productos.insertOne({
  nombre: "Audifonos Pro",
  precio: 120,
  categoria: "Tecnología",
  stock: 15
});


// ----- Selección de todos los documentos -----
db.productos.find();

// ----- Actualización de un documento -----
db.productos.updateOne(
  { nombre: "Audifonos Pro" },
  { $set: { stock: 20 } }
);

// ----- Eliminación de un documento -----
db.productos.deleteOne({ nombre: "Audifonos Pro" });




// ==========================================
// 3. CONSULTAS CON FILTROS Y OPERADORES
// ==========================================

// ----- Productos con precio mayor a 100 -----
db.productos.find({ precio: { $gt: 100 } });

// ----- Usuarios que viven en Colombia -----
db.usuarios.find({ pais: "Colombia" });

// ----- Productos de la categoría Tecnología y con stock > 10 -----
db.productos.find({
  categoria: "Tecnología",
  stock: { $gt: 10 }
});


// ==========================================
// 4. CONSULTAS DE AGREGACIÓN (ESTADÍSTICAS)
// ==========================================

// ----- Cantidad de productos por categoría -----
db.productos.aggregate([
  { $group: { _id: "$categoria", total: { $sum: 1 } } }
]);

// ----- Total de ventas registradas -----
db.ordenes.aggregate([
  { $group: { _id: null, totalVentas: { $sum: "$total" } } }
]);

// ----- Promedio de precios de los productos -----
db.productos.aggregate([
  { $group: { _id: null, promedioPrecio: { $avg: "$precio" } } }
]);

// ----- Promedio de edad de los usuarios -----
db.usuarios.aggregate([
  { $group: { _id: null, promedioEdad: { $avg: "$edad" } } }
]);

// ----- Total de órdenes por país -----
db.ordenes.aggregate([
  {
    $lookup: {
      from: "usuarios",
      localField: "usuario_id",
      foreignField: "_id",
      as: "usuario_info"
    }
  },
  { $unwind: "$usuario_info" },
  { $group: { _id: "$usuario_info.pais", totalOrdenes: { $sum: 1 } } }
]);
