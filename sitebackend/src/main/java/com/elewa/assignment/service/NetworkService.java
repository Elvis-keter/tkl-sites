package com.elewa.assignment.service;

import com.elewa.assignment.mapper.NetworkMapper;
import com.elewa.assignment.model.Network;
import com.elewa.assignment.model.Site;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NetworkService {
    @Autowired
    NetworkMapper networkMapper;

    public NetworkService(NetworkMapper networkMapper) {
        this.networkMapper = networkMapper;
    }

    public Integer findIdByName(String network_name) {
        return networkMapper.findIdByName(network_name);
    }

    public List<Network> findAll() {return networkMapper.findAll();}
    public Network findById(int id) {return networkMapper.findById(id);}
    public void updateNet(Network network) {networkMapper.updateNet(network);}
    public void saveNetwork(Network network) {networkMapper.saveNetwork(network);}
    public void deleteNetwork(int id) {networkMapper.deleteNetwork(id);}
}
