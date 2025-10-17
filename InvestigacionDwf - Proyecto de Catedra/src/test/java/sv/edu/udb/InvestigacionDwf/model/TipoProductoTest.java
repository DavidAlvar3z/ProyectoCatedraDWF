package sv.edu.udb.InvestigacionDwf.model;

import org.junit.jupiter.api.Test;
import sv.edu.udb.InvestigacionDwf.model.entity.Producto;
import sv.edu.udb.InvestigacionDwf.model.entity.TipoProducto;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TipoProductoTest {

    @Test
    void testConstructorAndGetters() {
        TipoProducto tipo = TipoProducto.builder()
                .idTipoProducto(1L)
                .tipo("Zapatos")
                .descripcion("Calzado formal")
                .build();

        assertEquals(1L, tipo.getIdTipoProducto());
        assertEquals("Zapatos", tipo.getTipo());
        assertEquals("Calzado formal", tipo.getDescripcion());
    }

    @Test
    void testSetters() {
        TipoProducto tipo = new TipoProducto();
        tipo.setIdTipoProducto(2L);
        tipo.setTipo("Pantalón");
        tipo.setDescripcion("Pantalón de mezclilla");

        assertEquals(2L, tipo.getIdTipoProducto());
        assertEquals("Pantalón", tipo.getTipo());
        assertEquals("Pantalón de mezclilla", tipo.getDescripcion());
    }

    @Test
    void testRelacionesBidireccionales() {
        TipoProducto tipo = new TipoProducto();
        Producto producto = Producto.builder().idProducto(1L).build();
        tipo.setProductos(List.of(producto));

        assertNotNull(tipo.getProductos());
        assertTrue(tipo.getProductos().contains(producto));
    }
}
