package com.elewa.assignment.mapper;

import com.elewa.assignment.model.Power;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PowerMapper {
    List<Power> findAll();
    Power findById(int id);
    Integer findIdByName(String main_power);
    void savePower(Power power);
    void updatePower(Power power);
    void deletePower(int id);
}
