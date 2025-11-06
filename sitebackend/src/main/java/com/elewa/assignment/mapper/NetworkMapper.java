package com.elewa.assignment.mapper;

import com.elewa.assignment.model.Network;
import com.elewa.assignment.model.Site;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface NetworkMapper {
    List<Network> findAll();
    Integer findIdByName(String network_name);
    Network findById(int id);
    void updateNet(Network network);
    void saveNetwork(Network network);
    void deleteNetwork(int id);
}
