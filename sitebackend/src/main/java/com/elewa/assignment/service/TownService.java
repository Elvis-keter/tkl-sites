package com.elewa.assignment.service;

import com.elewa.assignment.mapper.TownMapper;
import com.elewa.assignment.model.Town;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TownService {
    @Autowired
    TownMapper townMapper;

    public TownService(TownMapper townMapper) {
        this.townMapper = townMapper;
    }
    public Integer findIdByName(String town_name) {
        return townMapper.findIdByName(town_name);
    }
    public List<Town> findAll() {return townMapper.findAll();}
    public Town findById(int id) {return townMapper.findById(id);}
    public List<Town> findByRegionId(int regionId) {return townMapper.findByRegionId(regionId);}
}
