package com.digicard.nativeModule;

import android.content.Intent;
import android.nfc.NfcAdapter;
import android.provider.Settings;

import com.digicard.NFCExchange;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NFCService extends ReactContextBaseJavaModule {
    public NFCService(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNNFCPush";
    }

    @ReactMethod
    public void checkNFC(Promise promise) {
        NfcAdapter mNfcAdapter;
        mNfcAdapter = NfcAdapter.getDefaultAdapter(getReactApplicationContext());
        try {
            if(mNfcAdapter == null){
                promise.reject("0", "NFC Not Supported");
            }else{
                if(!mNfcAdapter.isEnabled()){
                    promise.reject("1", "NFC Is off");
                }else{
                    if(!mNfcAdapter.isNdefPushEnabled()){
                        promise.reject("2", "Android Beam Push Is Off");
                    }else{
                        promise.resolve("Pushing mother fucker!!!");
                    }
                }
            }
        }catch (Exception e){
            e.printStackTrace();
            promise.reject("3",e.getMessage());
        }
    }

    @ReactMethod
    public void invoke(String action ,String id){
        Intent it = new Intent(getReactApplicationContext(), NFCExchange.class);
        it.putExtra("id",id);
        it.putExtra("action",action);

        if (android.os.Build.VERSION.SDK_INT <= android.os.Build.VERSION_CODES.LOLLIPOP){
            //SDK < 5
            it.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        }
        getReactApplicationContext().startActivity(it);
    }

    @ReactMethod
    public void goAndroidPushSetting() {
        Intent setNfc = new Intent(Settings.ACTION_NFCSHARING_SETTINGS);
        if (android.os.Build.VERSION.SDK_INT <= android.os.Build.VERSION_CODES.LOLLIPOP){
            //SDK < 5
            setNfc.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        }
        getReactApplicationContext().startActivity(setNfc);
    }
}
