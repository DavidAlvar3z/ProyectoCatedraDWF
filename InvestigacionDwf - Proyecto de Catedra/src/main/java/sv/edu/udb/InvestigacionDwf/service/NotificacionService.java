package sv.edu.udb.InvestigacionDwf.service;

import sv.edu.udb.InvestigacionDwf.dto.response.NotificacionResponse;

import java.util.List;

public interface NotificacionService {
    List<NotificacionResponse> obtenerNotificacionesUsuario(Long idUsuario);
    void marcarComoLeida(Long idNotificacion);
}

