package com.elewa.assignment.service;

import com.elewa.assignment.mapper.RegionMapper;
import com.elewa.assignment.mapper.StatusMapper;
import com.elewa.assignment.model.Region;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegionService {
    @Autowired
    RegionMapper regionMapper;

    public RegionService(RegionMapper regionMapper) {
        this.regionMapper = regionMapper;
    }

    public List<Region> findAll() {return regionMapper.findAll();}
    public Region findById(int id) {return regionMapper.findById(id);}
    public List<Region> findTitleById(int regionId) {return regionMapper.findTitleById(regionId);}
    public Integer findIdByName(String region_name) {
        return regionMapper.findIdByName(region_name);
    }
}
