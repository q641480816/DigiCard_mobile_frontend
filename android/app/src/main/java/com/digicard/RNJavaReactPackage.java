package com.digicard;

import com.digicard.nativeModule.Debug;
import com.digicard.nativeModule.LocationService;
import com.digicard.nativeModule.NFCService;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Gods on 11/6/2017.
 */

public class RNJavaReactPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new NFCService(reactContext));
        modules.add(new LocationService(reactContext));
        modules.add(new Debug(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return new ArrayList<>();
    }
}
