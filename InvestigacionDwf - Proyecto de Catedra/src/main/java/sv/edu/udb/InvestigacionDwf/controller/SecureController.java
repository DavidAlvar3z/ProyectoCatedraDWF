package sv.edu.udb.InvestigacionDwf.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecureController {

    @GetMapping("/secure")
    @ResponseStatus(HttpStatus.OK) // Indica que se devolverá un 200 OK
    public String secureEndpoint() {
        return "Acceso seguro concedido";
    }
}

