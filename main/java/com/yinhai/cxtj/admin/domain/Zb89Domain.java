package com.yinhai.cxtj.admin.domain;


import com.yinhai.core.common.ta3.vo.BaseVo;

import java.util.HashMap;
import java.util.Map;

public class Zb89Domain extends BaseVo {
    private static final long serialVersionUID = 252842204712712604L;
    //多表配置详情流水号
    private String yzb890;
    //多表配置流水号
    private String yzb690;
    //表名称
    private String yzb891;
    //表字段
    private String yzb892;
    //字段注释
    private String yzb893;
    //字段类型
    private String yzb894;

    public String getYzb890() {
        return yzb890;
    }

    public void setYzb890(String yzb890) {
        this.yzb890 = yzb890;
    }

    public String getYzb690() {
        return yzb690;
    }

    public void setYzb690(String yzb690) {
        this.yzb690 = yzb690;
    }

    public String getYzb891() {
        return yzb891;
    }

    public void setYzb891(String yzb891) {
        this.yzb891 = yzb891;
    }

    public String getYzb892() {
        return yzb892;
    }

    public void setYzb892(String yzb892) {
        this.yzb892 = yzb892;
    }

    public String getYzb893() {
        return yzb893;
    }

    public void setYzb893(String yzb893) {
        this.yzb893 = yzb893;
    }

    public String getYzb894() {
        return yzb894;
    }

    public void setYzb894(String yzb894) {
        this.yzb894 = yzb894;
    }

    @Override
    public Map toMap() {
        Map map = new HashMap();
        map.put("yzb890", yzb890);
        map.put("yzb690", yzb690);
        map.put("yzb891", yzb891);
        map.put("yzb892", yzb892);
        map.put("yzb893", yzb893);
        map.put("yzb894", yzb894);
        return map;
    }

    @Override
    public String toString() {
        return "Zb89{" +
                ",yzb890 ='" + yzb890 + '\'' +
                ",yzb690 ='" + yzb690 + '\'' +
                ",yzb891 ='" + yzb891 + '\'' +
                ",yzb892 ='" + yzb892 + '\'' +
                ",yzb893 ='" + yzb893 + '\'' +
                ",yzb894 ='" + yzb894 + '\'' +
                '}';
    }

}