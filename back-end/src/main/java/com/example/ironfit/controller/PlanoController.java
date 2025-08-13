package com.example.ironfit.controller;

import com.example.ironfit.model.Plano;
import com.example.ironfit.repository.PlanoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plano")
public class PlanoController {

    private final PlanoRepository repository;

    public PlanoController(PlanoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Plano> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Plano salvar(@RequestBody Plano plano) {
        return repository.save(plano);
    }

    @GetMapping("/{id}")
    public Plano buscar(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Plano atualizar(@PathVariable Long id, @RequestBody Plano planoAtualizado) {
        return repository.findById(id).map(plano -> {
            plano.setNome(planoAtualizado.getNome());
            plano.setPreco(planoAtualizado.getPreco());
            plano.setDescricao(planoAtualizado.getDescricao());
            return repository.save(plano);
        }).orElseThrow();
    }

}
