package com.elewa.assignment.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "tb_status")
public class Status {
    private Integer id;
    private String enroachment_status;
    private String critical_to_enterprise;
    private String status_description;
    private String govt_equp;
    private String strategic_to_tkl;
    private String tkl_shop;
    private String atc_tower;
    private String charged_to_bank;
    private String on_sfc_deed;
    private String requested_by_sfc;
    private String on_atc_court;
    private String on_atc_deed;
    private String wholesale;
    private String ownership_docs;
    private String property_id;
}
