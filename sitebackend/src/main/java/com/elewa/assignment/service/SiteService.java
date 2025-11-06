package com.elewa.assignment.service;

import com.elewa.assignment.mapper.SiteMapper;
import com.elewa.assignment.model.Site;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SiteService {
    @Autowired
    SiteMapper siteMapper;

//    public String convertToDMS(String input) {
//        // Split degrees and minutes
//        String[] parts = input.split("°");
//        int degrees = Integer.parseInt(parts[0].trim());
//
//        String minutesWithDir = parts[1].trim();  // e.g., "13N"
//        int minutes = Integer.parseInt(minutesWithDir.replaceAll("[^0-9]", ""));
//        String direction = minutesWithDir.replaceAll("[0-9]", "");
//
//        // Calculate seconds (approximate conversion)
//        double seconds = (minutes % 1) * 60;
//        seconds = (minutes * 60) % 60;  // Rough estimate: use full minutes to seconds
//
//        // Format: 0°13'53.52"N
//        return String.format("%d°%d'%02.2f\"%s", degrees, minutes, seconds, direction);
//    }
    public String convertToDMS(double decimal, boolean isLatitude) {
        String direction;
        if (isLatitude) {
            direction = decimal >= 0 ? "N" : "S";
        } else {
            direction = decimal >= 0 ? "E" : "W";
        }

        decimal = Math.abs(decimal);
        int degrees = (int) decimal;
        int minutes = (int) ((decimal - degrees) * 60);

        return String.format("%d°%02d%s", degrees, minutes, direction);
    }


    private double convertToDecimal(String dmsInput) {
        String[] parts = dmsInput.split("°");
        int degrees = Integer.parseInt(parts[0].trim());

        String minutesWithDir = parts[1].trim(); // e.g. "13N"
        int minutes = Integer.parseInt(minutesWithDir.replaceAll("[^0-9]", ""));
        String direction = minutesWithDir.replaceAll("[0-9]", "").toUpperCase();

        double decimal = degrees + (minutes / 60.0);

        // South and West should be negative
        if ("S".equals(direction) || "W".equals(direction)) {
            decimal = -decimal;
        }

        return decimal;
    }



    public SiteService(SiteMapper siteMapper) {
        this.siteMapper = siteMapper;
    }

    public List<Site> findAll() {return siteMapper.findAll();}
    public Site findById(int id) {return siteMapper.findById(id);}
    public void updateSite(Site site) {siteMapper.updateSite(site);}
    public void saveSite(Site site) {siteMapper.saveSite(site);}
    public Integer countsites() {return siteMapper.countSites();}
    public void deleteSite(int id) {siteMapper.deleteSite(id);}
}
