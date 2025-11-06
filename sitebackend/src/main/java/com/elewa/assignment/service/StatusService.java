package com.elewa.assignment.service;

import com.elewa.assignment.mapper.StatusMapper;
import com.elewa.assignment.model.Network;
import com.elewa.assignment.model.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatusService {
    @Autowired
    StatusMapper statusMapper;

    public StatusService(StatusMapper statusMapper) {
        this.statusMapper = statusMapper;
    }

    public List<Status> findAll() {return statusMapper.findAll();}
    public Status findById(int id) {return statusMapper.findById(id);}
    public Integer findIdByName(String title) {
        return statusMapper.findIdByName(title);
    }
    public void updateStatus(Status status) {statusMapper.updateStatus(status);}
    public void deleteStatus(int id) {statusMapper.deleteStatus(id);}
    public void saveStatus(Status status) {statusMapper.saveStatus(status);}
}
