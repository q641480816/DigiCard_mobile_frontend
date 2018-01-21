package com.digicard.util;

import android.app.Activity;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by Gods on 1/21/2018.
 */

public class ActivityManager {

    private static HashMap<String ,Activity> activities = null;

    public static void addActivity(Activity a, String name){
        if(activities == null){
            activities = new HashMap<>();
        }

        activities.put(name,a);
    }

    public static void removeActivity(String name){
        activities.remove(name);
    }

    public static Activity getActivity(String name){
        return activities.get(name);
    }
}
