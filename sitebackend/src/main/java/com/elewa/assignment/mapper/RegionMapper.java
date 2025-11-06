package com.elewa.assignment.mapper;

import com.elewa.assignment.model.Region;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RegionMapper {
    List<Region> findAll();
    Region findById(int id);
    Integer findIdByName(String region_name);
    List<Region> findTitleById(int regionId);
}
