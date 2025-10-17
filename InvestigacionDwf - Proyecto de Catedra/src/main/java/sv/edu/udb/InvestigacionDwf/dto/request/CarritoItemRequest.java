package sv.edu.udb.InvestigacionDwf.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// CarritoItemRequest.java
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CarritoItemRequest {

    @NotNull(message = "Debe de existir un id del carrito donde se agregara el item")
    private Long idCarrito;

    @NotNull(message = "Se necesita el id del objeto a agregar")
    private Long idProducto;

    @Positive(message = "La cantidad debe ser un número positivo")
    private Integer cantidad;

}
