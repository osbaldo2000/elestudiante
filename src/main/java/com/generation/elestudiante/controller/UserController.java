package com.generation.elestudiante.controller;

import com.generation.elestudiante.dto.DirectionsRequest;
import com.generation.elestudiante.model.User;
import com.generation.elestudiante.repository.UserRepository;
import com.generation.elestudiante.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:63342")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id)
                .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public User addUser(@RequestBody User user){
        return userService.addUser(user);
    }

    @PostMapping(path = "{userId}/add-direction") // http://localhost:8080/api/users/2/add-direction
    public ResponseEntity<String> addDirectionUser(
            @PathVariable("userId") Integer id,
            @RequestBody DirectionsRequest directionsRequest) {
        try {
            userService.addDirectionUser(id, directionsRequest);
            return ResponseEntity.ok("Dirección agregada correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocurrió un error al agregar la dirección: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Integer userId, @RequestBody User updatedUser) {
        return userRepository.findById(userId).map(user -> {
            // Verificar si el correo ya está registrado en otro usuario
            Optional<User> existingUserWithEmail = userRepository.findByEmail(updatedUser.getEmail());
            if (existingUserWithEmail.isPresent() && !existingUserWithEmail.get().getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo ya está registrado por otro usuario");
            }

            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());

            // Encriptar la contraseña si se proporciona una nueva
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(updatedUser.getPassword());
                user.setPassword(encodedPassword);
            }

            user.setRole(updatedUser.getRole());
            userRepository.save(user);
            return ResponseEntity.ok("Usuario actualizado correctamente");
        }).orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al actualizar: datos incorrectos"));
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        return userService.getUserById(id)
                .map(user -> {
                    userService.deleteUser(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping(path = "login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
        }

        User existingUser = optionalUser.get();
        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("userId", existingUser.getUserId());
        return ResponseEntity.ok(response);
    }

}