package com.elewa.assignment.mapper;

import com.elewa.assignment.model.Site;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SiteMapper {
    List<Site> findAll();
    Site findById(int id);
    void updateSite(Site site);
    void saveSite(Site site);

    Integer countSites();
    void deleteSite(int id);
}
