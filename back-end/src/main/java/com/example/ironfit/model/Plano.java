package com.example.ironfit.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Plano {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String preco;
    private String descricao;
}
