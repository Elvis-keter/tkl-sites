package com.elewa.assignment.mapper;

import com.elewa.assignment.model.Properties;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PropertiesMapper {
    List<Properties> findAll();
    Properties findById(int id);
    Integer findIdByName(String asset_description);
    Integer findIdByTitle(String title);
    void updateProperties(Properties properties);
    void saveProperties(Properties properties);
    void deleteProperties(int id);
}
