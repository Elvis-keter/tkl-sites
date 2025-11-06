package com.elewa.assignment.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "tb_network")
public class Network {
    private Integer id;
    private String network_name;
    private String network_equip;
}
