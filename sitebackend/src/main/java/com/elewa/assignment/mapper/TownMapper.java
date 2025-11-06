package com.elewa.assignment.mapper;

import com.elewa.assignment.model.Town;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TownMapper {
    List<Town> findAll();
    Town findById(int id);
    List<Town> findByRegionId(int regionId);
    Integer findIdByName(String town_name);
}
