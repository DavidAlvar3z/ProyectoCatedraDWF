package sv.edu.udb.InvestigacionDwf.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HistorialPuntosRequest {
    private Long idUser;
    private Long idPedido;
    private LocalDateTime fecha;
    private Integer cantidadAnterior;
    private Integer cantidadNueva;
}

