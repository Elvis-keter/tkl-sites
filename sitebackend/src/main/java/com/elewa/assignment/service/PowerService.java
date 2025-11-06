package com.elewa.assignment.service;

import com.elewa.assignment.mapper.PowerMapper;
import com.elewa.assignment.model.Power;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PowerService {
    @Autowired
    PowerMapper powerMapper;

    public PowerService(PowerMapper powerMapper) {
        this.powerMapper = powerMapper;
    }
    public Integer findIdByName(String main_power) {return powerMapper.findIdByName(main_power);}
    public List<Power> findAll() {return powerMapper.findAll();}
    public Power findById(int id) {return powerMapper.findById(id);}
    public void updatePower(Power power) {powerMapper.updatePower(power);}
    public void savePower(Power power) {powerMapper.savePower(power);}
    public void deletePower(int id) {powerMapper.deletePower(id);}
}
