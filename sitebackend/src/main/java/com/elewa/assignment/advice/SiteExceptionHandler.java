package com.elewa.assignment.advice;

import org.apache.ibatis.binding.BindingException;
import org.mybatis.spring.MyBatisSystemException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.management.openmbean.KeyAlreadyExistsException;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDateTime;
import java.util.DuplicateFormatFlagsException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@RestController
public class SiteExceptionHandler {
    @ExceptionHandler(value = {DataIntegrityViolationException.class})
    public ResponseEntity<Object> integrityException(DataIntegrityViolationException e) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Cannot delete or update a parent row: a foreign key constraint fails");
    }

    @ExceptionHandler(value = {NullPointerException.class})
    public ResponseEntity<Object> nullException(NullPointerException e) {
        return buildResponse(HttpStatus.NOT_FOUND, "Record not available. Return value is null");
    }

    @ExceptionHandler(value = {BindingException.class})
    public ResponseEntity<Object> bindingException(BindingException e) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Attempted to return null from a method with a primitive return type");
    }

    @ExceptionHandler(value = {MyBatisSystemException.class})
    public ResponseEntity<Object> batisException(MyBatisSystemException e) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Expected one result (or null) to be returned, but found: 2");
    }

    private ResponseEntity<Object> buildResponse(HttpStatus status, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", status.getReasonPhrase());
        response.put("message", message);

        return new ResponseEntity<>(response, status);
    }
}
