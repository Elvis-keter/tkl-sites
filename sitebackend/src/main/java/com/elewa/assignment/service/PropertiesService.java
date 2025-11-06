package com.elewa.assignment.service;

import com.elewa.assignment.mapper.PropertiesMapper;
import com.elewa.assignment.model.Properties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertiesService {
    @Autowired
    PropertiesMapper propertiesMapper;

    public PropertiesService(PropertiesMapper propertiesMapper) {
        this.propertiesMapper = propertiesMapper;
    }

    public List<Properties> findAll() {return propertiesMapper.findAll();}
    public Properties findById(int id) {return propertiesMapper.findById(id);}
    public Integer findIdByName(String asset_description) {
        return propertiesMapper.findIdByName(asset_description);
    }
    public Integer findIdByTitle(String title) {
        return propertiesMapper.findIdByTitle(title);
    }
    public void updateProperties(Properties properties) {propertiesMapper.updateProperties(properties);}
    public void saveProperties(Properties properties) {propertiesMapper.saveProperties(properties);}
    public void deleteProperties(int id) {propertiesMapper.deleteProperties(id);}
}
