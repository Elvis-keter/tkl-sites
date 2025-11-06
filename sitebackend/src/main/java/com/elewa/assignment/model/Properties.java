package com.elewa.assignment.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "tb_properties")
public class Properties {
    private Integer id;
    private String title;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAsset_description() {
        return asset_description;
    }

    public void setAsset_description(String asset_description) {
        this.asset_description = asset_description;
    }

    public Double getPlot_size() {
        return plot_size;
    }

    public void setPlot_size(Double plot_size) {
        this.plot_size = plot_size;
    }

    public Double getBua() {
        return bua;
    }

    public void setBua(Double bua) {
        this.bua = bua;
    }

    public Integer getFair_value() {
        return fair_value;
    }

    public void setFair_value(Integer fair_value) {
        this.fair_value = fair_value;
    }

    public Integer getLand() {
        return land;
    }

    public void setLand(Integer land) {
        this.land = land;
    }

    public Integer getImprovements() {
        return improvements;
    }

    public void setImprovements(Integer improvements) {
        this.improvements = improvements;
    }

    public Integer getTotal_value() {
        return total_value;
    }

    public void setTotal_value(Integer total_value) {
        this.total_value = total_value;
    }

    private String asset_description;
    private Double plot_size;
    private Double bua;
    private Integer fair_value;
    private Integer land;
    private Integer improvements;
    private Integer total_value;
}
