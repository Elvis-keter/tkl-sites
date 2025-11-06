package com.elewa.assignment.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "tb_region")
public class Region {
    private Integer id;
    private String region_name;
}