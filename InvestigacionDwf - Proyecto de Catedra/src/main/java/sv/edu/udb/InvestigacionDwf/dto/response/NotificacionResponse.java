// NotificacionResponse.java
package sv.edu.udb.InvestigacionDwf.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificacionResponse {
    private Long id;
    private String mensaje;
    private LocalDateTime fechaEnvio;
    private String estado;
    private Long pedidoId;
}

