package com.elewa.assignment.controller;

import com.elewa.assignment.model.*;
import com.elewa.assignment.service.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1")
//@CrossOrigin(origins = "http://localhost:3000")
public class RegionController {
    private final RegionService regionService;
    private final TownService townService;
    private final StatusService statusService;
    private final NetworkService networkService;
    private final PowerService powerService;
    private final PropertiesService propertiesService;
    private final SiteService siteService;

    @Autowired
    public RegionController(RegionService regionService, TownService townService,
                            StatusService statusService, NetworkService networkService,
                            PowerService powerService, PropertiesService propertiesService,
                            SiteService siteService) {
        this.regionService = regionService;
        this.townService = townService;
        this.statusService = statusService;
        this.networkService = networkService;
        this.powerService = powerService;
        this.propertiesService = propertiesService;
        this.siteService = siteService;
    }

    /*count*/
    @GetMapping("/count-sites")
    public ResponseEntity<Map<String, Object>> countSites() {
        int count = siteService.countsites();
        Map<String, Object> response = new HashMap<>();
        response.put("totalSites", count);
        return ResponseEntity.ok(response);
    }

    /*view*/
    @GetMapping("/properties")
    public  ResponseEntity<List<Properties>> getProperties() {
        return ResponseEntity.ok(propertiesService.findAll());
    }

    @GetMapping("/regions")
    public ResponseEntity<List<Region>> regions() {
        List<Region> regions = regionService.findAll();
        return ResponseEntity.ok(regions);
    }

    @GetMapping("/towns")
    public ResponseEntity<List<Town>> towns() {
        return ResponseEntity.ok(townService.findAll());
    }

    @GetMapping("/networks")
    public ResponseEntity<List<Network>> networks() {
        return ResponseEntity.ok(networkService.findAll());
    }

    @GetMapping("/power")
    public ResponseEntity<List<Power>> power() {
        return ResponseEntity.ok(powerService.findAll());
    }

    @GetMapping("/sites")
    public ResponseEntity<List<Site>> sites() {
        return ResponseEntity.ok(siteService.findAll());
    }

    @GetMapping("/status")
    public ResponseEntity<List<Status>> status() {
        return ResponseEntity.ok(statusService.findAll());
    }

    /*endoffetch*/
    //find
    @GetMapping("/sites/{id}")
    public ResponseEntity<Site> getSiteId(@PathVariable("id") int id) {
        return ResponseEntity.ok(siteService.findById(id));
    }

    @GetMapping("/towns/{id}")
    public ResponseEntity<Town> getTownId(@PathVariable("id") int id) {
        return ResponseEntity.ok(townService.findById(id));
    }

    @GetMapping("/properties/{id}")
    public ResponseEntity<Properties> getPropertiesId(@PathVariable("id") int id) {
        return ResponseEntity.ok(propertiesService.findById(id));
    }

    @GetMapping("/regions/{id}")
    public ResponseEntity<Region> getRegionId(@PathVariable("id") int id) {
        return ResponseEntity.ok(regionService.findById(id));
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<Status> getStatusId(@PathVariable("id") int id) {
        return ResponseEntity.ok(statusService.findById(id));
    }

    @GetMapping("/networks/{id}")
    public ResponseEntity<Network> getNetworkId(@PathVariable("id") int id) {
        return ResponseEntity.ok(networkService.findById(id));
    }

    @GetMapping("/power/{id}")
    public ResponseEntity<Power> getPower(@PathVariable("id") int id) {
        return ResponseEntity.ok(powerService.findById(id));
    }

    /*PostMappers*/
    @PostMapping("/sites/new")
    @Transactional
    public ResponseEntity<?> createSiteWithStatus(@RequestBody Site siteNew) {
        try {
            Integer propertyId = propertiesService.findIdByTitle(siteNew.getProperty_id());
            if (propertyId == null) {
                return ResponseEntity.badRequest().body("Property " + siteNew.getProperty_id() + " does not exist. Create one");
            }

//            Integer statusTitleId = statusService.findIdByName(siteNew.getStatus_id());
//            if (statusTitleId != null) {
//                return ResponseEntity.badRequest().body("A site with this property ID already exists.");
//            }

            Status newStatus = new Status();
            newStatus.setEnroachment_status(siteNew.getEnroachment_status());
            newStatus.setCritical_to_enterprise(siteNew.getCritical_to_enterprise());
            newStatus.setStatus_description(siteNew.getStatus_description());
            newStatus.setGovt_equp(siteNew.getGovt_equp());
            newStatus.setStrategic_to_tkl(siteNew.getStrategic_to_tkl());
            newStatus.setTkl_shop(siteNew.getTkl_shop());
            newStatus.setAtc_tower(siteNew.getAtc_tower());
            newStatus.setCharged_to_bank(siteNew.getCharged_to_bank());
            newStatus.setOn_sfc_deed(siteNew.getOn_sfc_deed());
            newStatus.setRequested_by_sfc(siteNew.getRequested_by_sfc());
            newStatus.setOn_atc_court(siteNew.getOn_atc_court());
            newStatus.setOn_atc_deed(siteNew.getOn_atc_deed());
            newStatus.setWholesale(siteNew.getWholesale());
            newStatus.setOwnership_docs(siteNew.getOwnership_docs());
            newStatus.setProperty_id(String.valueOf(propertyId));

            statusService.saveStatus(newStatus);
            if (newStatus.getId() == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to create status");
            }

            Site newSite = new Site();
            newSite.setSite_id(siteNew.getSite_id());
            newSite.setDescription(siteNew.getDescription());

            // Handle coordinate conversion (decimal to DMS)
            try {
                double lat = Double.parseDouble(siteNew.getLatitude());
                double lon = Double.parseDouble(siteNew.getLongitude());
                String dmsLat = siteService.convertToDMS(lat, true);
                String dmsLon = siteService.convertToDMS(lon, false);
                newSite.setLatitude(dmsLat);
                newSite.setLongitude(dmsLon);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body("Invalid Lat/Lon provided");
            }

            //  other relationships
            Integer townId = townService.findIdByName(siteNew.getTown_id());
            Integer regionId = regionService.findIdByName(siteNew.getRegion_id());
            Integer powerId = powerService.findIdByName(siteNew.getPower_id());
            Integer networkId = networkService.findIdByName(siteNew.getNetwork_id());

            newSite.setProperty_id(String.valueOf(propertyId));
            newSite.setTown_id(String.valueOf(townId));
            newSite.setRegion_id(String.valueOf(regionId));
            newSite.setPower_id(String.valueOf(powerId));
            newSite.setNetwork_id(String.valueOf(networkId));

            // Set the status ID from our newly created status
            newSite.setStatus_id(String.valueOf(newStatus.getId()));

            siteService.saveSite(newSite);

            return ResponseEntity.ok(newSite);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Duplicate entry for property_id : " + e.getMostSpecificCause().getMessage());

        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating site with status: " + e.getMessage());
        }
    }

    @PostMapping("/networks/new")
    public ResponseEntity<Network> saveNetwork(@RequestBody Network networkNew) {
        networkService.saveNetwork(networkNew);
        return ResponseEntity.ok(networkNew);
    }

    @PostMapping("/status/new")
    public ResponseEntity<Status> saveStatus(@RequestBody Status statusNew) {
        Integer propertyId = propertiesService.findIdByTitle(statusNew.getProperty_id());
        System.out.println(propertyId);
        statusNew.setProperty_id(String.valueOf(propertyId));
        System.out.println(statusNew.getProperty_id());
        statusService.saveStatus(statusNew);
        return ResponseEntity.ok(statusNew);
    }

    @PostMapping("/power/new")
    public ResponseEntity<Power> savePower(@RequestBody Power powerNew) {
        powerService.savePower(powerNew);
        return ResponseEntity.ok(powerNew);
    }

    @PostMapping("/properties/new")
    public ResponseEntity<?> saveProperties(@RequestBody Properties propertiesNew) {
        Integer titleId = propertiesService.findIdByTitle(propertiesNew.getTitle());
        Integer assetId = propertiesService.findIdByName(propertiesNew.getAsset_description());
        if (titleId != null) {
            return ResponseEntity.badRequest().body("Title already exists");
        } else if (assetId != null) {
            return ResponseEntity.badRequest().body("Asset already exists");
        }
        propertiesService.saveProperties(propertiesNew);
        return ResponseEntity.ok(propertiesNew);
    }

    /*updating*/
    @PostMapping("/sites/update/{id}")
    public ResponseEntity<Site> updateSite(@PathVariable Integer id, @RequestBody Site siteData) {
        double longitude = Double.parseDouble(siteData.getLongitude());
        double latitude = Double.parseDouble(siteData.getLatitude());

        String dmsLat = siteService.convertToDMS(latitude, true);   // true = is latitude
        String dmsLon = siteService.convertToDMS(longitude, false);  // false = is longitude

        // Store DMS format
        siteData.setLatitude(dmsLat);
        siteData.setLongitude(dmsLon);

        Integer statusId = statusService.findIdByName(String.valueOf(siteData.getStatus_id()));
        Integer propertyId = propertiesService.findIdByName(String.valueOf(siteData.getProperty_id()));
        Integer townId = townService.findIdByName(siteData.getTown_id());
        Integer regionId = regionService.findIdByName(siteData.getRegion_id());
        Integer powerId = powerService.findIdByName(String.valueOf(siteData.getPower_id()));
        Integer networkId = networkService.findIdByName(String.valueOf(siteData.getNetwork_id()));

        siteData.setProperty_id(String.valueOf(propertyId));
        siteData.setStatus_id(String.valueOf(statusId));
        siteData.setTown_id(String.valueOf(townId));
        siteData.setRegion_id(String.valueOf(regionId));
        siteData.setNetwork_id(String.valueOf(networkId));
        siteData.setPower_id(String.valueOf(powerId));
        siteData.setId(id);

        siteService.updateSite(siteData);

        return ResponseEntity.ok(siteData);
    }

    @PostMapping("/networks/update/{id}")
    public ResponseEntity<Network> updateNetwork(@PathVariable Integer id, @RequestBody Network networkData) {
        networkData.setId(id);
        networkService.updateNet(networkData);
        return ResponseEntity.ok(networkData);
    }

    @PostMapping("/status/update/{id}")
    public ResponseEntity<Status> updateStatus(@PathVariable Integer id, @RequestBody Status statusData) {
        Integer propertyId = propertiesService.findIdByTitle(statusData.getProperty_id());
        statusData.setProperty_id(String.valueOf(propertyId));
        statusData.setId(id);
        statusService.updateStatus(statusData);
        return ResponseEntity.ok(statusData);
    }

    @PostMapping("/power/update/{id}")
    public ResponseEntity<Power> updatePower(@PathVariable Integer id,@RequestBody Power powerData) {
        powerData.setId(id);
        powerService.updatePower(powerData);
        return ResponseEntity.ok(powerData);
    }

    @PostMapping("/properties/update/{id}")
    public ResponseEntity<Properties> updateProperties(@PathVariable Integer id, @RequestBody Properties propertiesData) {
        propertiesData.setId(id);
        propertiesService.updateProperties(propertiesData);
        return ResponseEntity.ok(propertiesData);
    }

    /*deletion */

    @PostMapping("/sites/{id}")
    public ResponseEntity<?> deleteSite(@PathVariable("id") int id) {
        Site site = siteService.findById(id);
        if (site == null) {
            throw new NullPointerException();
        }
        siteService.deleteSite(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Site deleted successfully");
    }

    @PostMapping("/networks/{id}")
    public ResponseEntity<?> deleteNetwork(@PathVariable Integer id) {
        Network network = networkService.findById(id);
        if (network == null) {
            throw new NullPointerException();
        }
        networkService.deleteNetwork(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Network deleted successfully");
    }

    @PostMapping("/status/{id}")
    public ResponseEntity<?> deleteStatus(@PathVariable Integer id) {
        Status status = statusService.findById(id);
        if (status == null) {
            throw new NullPointerException();
        }
        statusService.deleteStatus(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Status deleted successfully");
    }

    @PostMapping("/power/{id}")
    public ResponseEntity<?> deletePower(@PathVariable Integer id) {
        Power power = powerService.findById(id);
        if (power == null) {
            throw new NullPointerException();
        }
        powerService.deletePower(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Power deleted successfully");
    }

    @PostMapping("/properties/{id}")
    public ResponseEntity<?> deleteProperty(@PathVariable Integer id) {
        Properties properties = propertiesService.findById(id);
        if (properties == null) {
            throw new NullPointerException();
        }
        propertiesService.deleteProperties(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Properties deleted successfully");
    }
}