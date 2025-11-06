package com.elewa.assignment.mapper;

import com.elewa.assignment.model.Network;
import com.elewa.assignment.model.Status;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StatusMapper {
    List<Status> findAll();
    Status findById(int id);
    Integer findIdByName(String title);
    void saveStatus(Status status);
    void updateStatus(Status status);
    void deleteStatus(int id);
}
