package sv.edu.udb.InvestigacionDwf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.InvestigacionDwf.model.entity.Notificacion;
import sv.edu.udb.InvestigacionDwf.model.entity.User;
import sv.edu.udb.InvestigacionDwf.model.enums.EstadoNotificacion;

import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUserAndEstado(User user, EstadoNotificacion estado);
    List<Notificacion> findByUser(User user);
}

