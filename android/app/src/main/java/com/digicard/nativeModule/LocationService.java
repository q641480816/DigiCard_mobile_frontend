package com.digicard.nativeModule;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Gods on 1/11/2018.
 */

public class LocationService extends ReactContextBaseJavaModule implements LocationListener {

    private String locationProvider = "";
    private LocationManager locationManager;

    public LocationService(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "LocationService";
    }

    @ReactMethod
    public void getLocation(Promise promise) {
        locationManager = (LocationManager) getReactApplicationContext().getSystemService(Context.LOCATION_SERVICE);
        if (checkPermission()) {
            List<String> providers = locationManager.getProviders(true);
            System.out.println(providers);
            if (providers.contains(LocationManager.GPS_PROVIDER)) {
                locationProvider = LocationManager.GPS_PROVIDER;
            } else if (providers.contains(LocationManager.NETWORK_PROVIDER)) {
                locationProvider = LocationManager.NETWORK_PROVIDER;
            }else{
                locationProvider = "";
                promise.reject("1", "Unknown Error!");
            }
            if (locationProvider.length() > 0){
                locationManager.requestLocationUpdates(locationProvider,1000,0,this);
                promise.resolve(getCurrent(locationProvider));
            }
        }else{
            promise.reject("0", "No Permission(s)");
        }
    }

    @SuppressLint("MissingPermission")
    private String getCurrent(String provider){
        Location location = locationManager.getLastKnownLocation(provider);
        while(location == null){
            location = locationManager.getLastKnownLocation(provider);
        }
        String rs = location.getLatitude() + "," + location.getLongitude();
        locationManager.removeUpdates(this);
        return rs;
    }

    private boolean checkPermission(){
        List<String> tempPermission = new ArrayList<>();
        if (ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED){
            tempPermission.add(Manifest.permission.ACCESS_FINE_LOCATION);
        }
        if (ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED){
            tempPermission.add(Manifest.permission.ACCESS_COARSE_LOCATION);
        }

        String[] requestPermissions = tempPermission.toArray(new String[tempPermission.size()]);
        // request permissions
        return requestPermissions.length == 0;
    }

    @Override
    public void onLocationChanged(Location location) {
        System.out.println(location.getLatitude() + "," + location.getLongitude());
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {

    }

    @Override
    public void onProviderEnabled(String s) {

    }

    @Override
    public void onProviderDisabled(String s) {

    }
}
