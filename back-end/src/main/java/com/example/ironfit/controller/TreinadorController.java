package com.example.ironfit.controller;

import com.example.ironfit.model.Treinador;
import com.example.ironfit.repository.TreinadorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/treinadores")
public class TreinadorController {

    private final TreinadorRepository repository;

    public TreinadorController(TreinadorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Treinador> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Treinador salvar(@RequestBody Treinador treinador) {
        return repository.save(treinador);
    }

    @GetMapping("/{id}")
    public Treinador buscar(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
