package com.example.ironfit.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Treinador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String iniciais;
    private String nome;
    private String especialidade;
}