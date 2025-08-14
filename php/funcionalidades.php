<?php
// 1. Conexión a la base de datos
$conexion = new mysqli("localhost", "usuario", "contraseña", "nombre_bd");
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// 2. Consulta a la base de datos
$sql = "SELECT * FROM funcionalidades";
$resultado = $conexion->query($sql);
?>

<!-- Start Product Section -->
<div class="product-section">
    <div class="container">
        <div class="row">

            <!-- Columna de descripción -->
            <div class="col-md-12 col-lg-3 mb-5 mb-lg-0">
                <h2 class="mb-4 section-title">Desarrollado a tu medida.</h2>
                <p class="mb-4">Selecciona las funcionalidades que necesitas: nosotros desarrollamos tu página web, aplicación o sistema personalizado según tus requerimientos.</p>
                <p><a href="shop.html" class="btn">Descubre cómo</a></p>
            </div>

            <?php while ($row = $resultado->fetch_assoc()): ?>
                <div class="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
                    <a class="product-item" href="<?php echo $row['enlace']; ?>">
                        <img src="<?php echo $row['imagen']; ?>" class="img-fluid product-thumbnail">
                        <h3 class="product-title"><?php echo $row['titulo']; ?></h3>
                        <strong class="product-price">$<?php echo number_format($row['precio'], 2); ?></strong>
                        <span class="icon-cross">
                            <img src="images/cross.svg" class="img-fluid">
                        </span>
                    </a>
                </div>
            <?php endwhile; ?>

        </div>
    </div>
</div>
<!-- End Product Section -->

<?php
$conexion->close();
?>
