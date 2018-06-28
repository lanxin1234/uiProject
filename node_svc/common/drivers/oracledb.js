/* global __dirname */
/* global process */
'use strict';

let oracle = require('oracledb');
let yaml = require('js-yaml');
let fs = require('fs');
let path = require('path');
let logger = require('./logger').getLogger();

function oracleClient(cfg) {
    this.config = cfg;
    this.SQL = {
        getAllStore: "select mucname, mucode from manaunit",
        // 订单金额
        orderAmount: "select Sum(D) day ,Sum(M) Mon, Sum(Y) Year  From VIEW_INTERFACE_PM_A \
        where type='order_je'",
        // 订单数量
        totalOrder: "select Sum(D) day ,Sum(M) Mon, Sum(Y) Year  From VIEW_INTERFACE_PM_A \
        where type='order_sl'",
        // 客单价
        perCustomerTransaction: "select round(tje.day_je / decode(tsl.day_sl, '0', '1'), 2) \
        Day_kdj, round(tje.mon_je / decode(tsl.mon_sl, '0', '1'), 2) mon_kdj, round(tje.year_je \
        / decode(tsl.year_sl, '0', '1'), 2) year_kdj from (select Sum(D) day_je, Sum(M) Mon_je, \
        Sum(Y) Year_je From VIEW_INTERFACE_PM_A where type = 'order_je') tje, (select Sum(D) \
        day_sl, Sum(M) Mon_sl, Sum(Y) Year_sl From VIEW_INTERFACE_PM_A where type = 'order_sl') tsl",
        // 线上销售数量
        onlineSales: "select Sum(D) day_ol, Sum(M) Mon_ol, Sum(Y) Year_ol From VIEW_INTERFACE_PM_A \
        where type = 'order_ol'",
        // 客流量
        trafficCounting: "select Sum(D) day_uv, Sum(M) Mon_uv, Sum(Y) Year_uv From \
        VIEW_INTERFACE_PM_A where type = 'order_uv'",
        // 转化率
        conversionRates: "select round(tol.day_ol / decode(tuv.day_uv, '0', '1'), 2) Day_roi, \
        round(tol.mon_ol / decode(tuv.mon_uv, '0', '1'), 2) mon_roi, round(tol.year_ol / decode\
        (tuv.year_uv, '0', '1'), 2) year_roi From (select Sum(D) day_uv, Sum(M) Mon_uv, Sum(Y) \
        Year_uv From VIEW_INTERFACE_PM_A where type = 'order_uv') tuv, (select Sum(D) day_ol, \
        Sum(M) Mon_ol, Sum(Y) Year_ol From VIEW_INTERFACE_PM_A where type = 'order_ol') tol",
        // 销售店排行
        topStores: `select mucname, d xssr From VIEW_INTERFACE_PM_A,manaunit where type = 'order_je' and mucode=shmarket 
        order by d`,
        // 数据趋势
        dataTrend: `select trunc(sddate,'mm') yue ,'[' || mucode || ']' || mucode "门店",
        sum(xssr) xssr, sum(xssl) xssl From saleday, manaunit where sddate >= trunc(sysdate,'yyyy')      
        and mucode = mkt group by mucode,trunc(sddate,'mm') order by yue`,
        dataTrendParam: `select trunc(sddate,'mm') yue ,'[' || mucode || ']' || mucode "门店",
        sum(xssr) xssr, sum(xssl) xssl From saleday, manaunit where sddate >= trunc(sysdate,'yyyy')      
        and mucode = :num group by mucode,trunc(sddate,'mm') order by yue`,
        // 销售年进度
        saleProgress: "select tb.jhxs, ta.sjxs, Round(ta.sjxs / Nvl(tb.jhxs, '1'), 2) xsdcl, tb.jhml, ta.sjml, \
        Round(ta.sjml / nvl(tb.jhml, '1'), 2) mldcl From (SELECT SUM(XSSR + PFSR) sjxs, SUM(XSCBJML + PFCBJML) \
        sjml FROM SALECOSTDAY WHERE To_Char(SCDDATE, 'YYYY') = To_char(Trunc(sysdate), 'YYYY') ) ta, \
        (SELECT Sum(pmfidx4) jhxs, Sum(pmfidx6) jhml FROM PLANMFRAME WHERE PMFTYPE = '0' AND PMFYEAR = To_CHAR(Trunc(sysdate), 'YYYY')) tb",
        // 门店销售进度
        storeSalesProcess: "select ta.mkt, tb.jhxs, ta.sjxs, Round(ta.sjxs / Nvl(tb.jhxs, '1'), 2) xsdcl, tb.jhml, ta.sjml, \
        Round(ta.sjml / nvl(tb.jhml, '1'), 2) mldcl From (SELECT SCDMKT mkt, SUM(XSSR + PFSR) sjxs, \
        SUM(XSCBJML + PFCBJML) sjml FROM SALECOSTDAY WHERE To_Char(SCDDATE, 'YYYY') = To_char(Trunc(sysdate), 'YYYY') \
        GROUP BY SCDMKT) ta, (SELECT pmfmkt mkt, Sum(pmfidx4) jhxs, Sum(pmfidx6) jhml FROM PLANMFRAME WHERE PMFTYPE = '0' \
        AND PMFYEAR = To_CHAR(Trunc(sysdate), 'YYYY') Group By pmfmkt) tb where ta.mkt = tb.mkt(+) and ta.mkt=:num order by ta.mkt",
        // 一级品类
        firstGrade: "select '['||Substr(SGLCATID, 1,2)||']'|| catcname splb, Round(sum(SGLPFSR + SGLXSSR),2) xssr, \
        Round(Sum(sgln2),2) ml, count(distinct(sglbillno)) kdl, Round(sum(SGLPFSR + SGLXSSR) / count(\
        distinct(sglbillno)) )kdj from SALEGOODSLIST, goodsbase, VIEW_MFRAME_ALL, manaunit, GoodsCat \
        where sglgdid = GBID AND SGLMFID = CLASS3 AND sglmarket = mucode AND SGLDATE = Trunc(sysdate) \
        and Substr(SGLCATID, 1,2) = Catcode AND 'SALEGOODSLIST.SGLMFID' = 'SALEGOODSLIST.SGLMFID' AND \
        'SALEGOODSLIST.SGLCATID' = 'SALEGOODSLIST.SGLCATID' AND 'SALEGOODSLIST.SGLPPCODE' = 'SALEGOODSLIST.SGLPPCODE' \
        AND 'VIEW_MFRAME_ALL.CLASS1' = 'VIEW_MFRAME_ALL.CLASS1' AND 'VIEW_MFRAME_ALL.SPBM' = 'VIEW_MFRAME_ALL.SPBM' \
        AND 'SALEGOODSLIST.SGLSUPID' = 'SALEGOODSLIST.SGLSUPID' Group by '['||Substr(SGLCATID, 1,2)||']'|| catcname",
        // 二级品类
        secondGrade: "select '['||SGLCATID||']'|| catcname splb, Round(sum(SGLPFSR + SGLXSSR),2) xssr, Round(Sum(sgln2),2) \
        ml, count(distinct(sglbillno)) kdl, Round(sum(SGLPFSR + SGLXSSR) / count(distinct(sglbillno)) )kdj from \
        SALEGOODSLIST, goodsbase, VIEW_MFRAME_ALL, manaunit, GoodsCat where sglgdid = GBID AND SGLMFID = CLASS3 \
        AND sglmarket = mucode AND SGLDATE = Trunc(sysdate)-100 and SGLCATID = Catcode AND 'SALEGOODSLIST.SGLMFID' \
        = 'SALEGOODSLIST.SGLMFID' AND 'SALEGOODSLIST.SGLCATID' = 'SALEGOODSLIST.SGLCATID' AND 'SALEGOODSLIST.SGLPPCODE' \
        = 'SALEGOODSLIST.SGLPPCODE' AND 'VIEW_MFRAME_ALL.CLASS1' = 'VIEW_MFRAME_ALL.CLASS1' AND 'VIEW_MFRAME_ALL.SPBM' = \
        'VIEW_MFRAME_ALL.SPBM' AND 'SALEGOODSLIST.SGLSUPID' = 'SALEGOODSLIST.SGLSUPID' Group by '['||SGLCATID||']'|| catcname",
        // 门店动态
        storeDynamic: `SELECT mucname, SUM(XSSR + PFSR) sjxs FROM SALECOSTDAY ,manaunit WHERE SCDDATE = Trunc(sysdate) and scdmkt=mucode GROUP BY mucname order by sjxs desc`,
        // 新品销售动态
        newProductsDynamic: "select sglgdid, gbcname, sum(SGLPFSR + SGLXSSR) xssr, Sum(sgln2) from SALEGOODSLIST, \
        goodsbase_New, VIEW_MFRAME_ALL where sglgdid = GBID AND SGLMFID = CLASS3 AND SGLDATE = \
        Trunc(sysdate) AND 'SALEGOODSLIST.SGLMFID' = 'SALEGOODSLIST.SGLMFID' AND 'SALEGOODSLIST.SGLCATID' = \
        'SALEGOODSLIST.SGLCATID' AND 'SALEGOODSLIST.SGLPPCODE' = 'SALEGOODSLIST.SGLPPCODE' AND 'VIEW_MFRAME_ALL.CLASS1' = \
        'VIEW_MFRAME_ALL.CLASS1' AND 'VIEW_MFRAME_ALL.SPBM' = 'VIEW_MFRAME_ALL.SPBM' AND 'SALEGOODSLIST.SGLSUPID' = \
        'SALEGOODSLIST.SGLSUPID' group by sglgdid, gbcname",
        // 畅销商品动态
        sellingProductsDynamic: "select * from (select sglgdid, gbcname, sum(SGLPFSR + SGLXSSR) xssr, RANK() OVER(ORDER BY sum(SGLPFSR + \
        SGLXSSR) DESC) AS rank from SALEGOODSLIST, goodsbase, VIEW_MFRAME_ALL where sglgdid = GBID AND SGLMFID \
        = CLASS3 AND  gbwmid='1' AND SGLDATE = Trunc(sysdate) AND 'SALEGOODSLIST.SGLCATID' = 'SALEGOODSLIST.SGLCATID' \
        AND 'VIEW_MFRAME_ALL.CLASS1' = 'VIEW_MFRAME_ALL.CLASS1' group by sglgdid, gbcname order by xssr desc) where rank <= nvl('10', 10)",
        // 滞销商品动态
        unsalableProductsDynamic: "select * from (select sglgdid , gbcname, sum(SGLPFSR + SGLXSSR) xssr, RANK() OVER(ORDER BY \
        sum(SGLPFSR + SGLXSSR)) AS rank from SALEGOODSLIST, goodsbase, VIEW_MFRAME_ALL where sglgdid = \
        GBID AND SGLMFID = CLASS3 AND SGLDATE =Trunc(sysdate) AND gbwmid='1' AND 'SALEGOODSLIST.SGLMFID' = \
        'SALEGOODSLIST.SGLMFID' AND 'SALEGOODSLIST.SGLCATID' = 'SALEGOODSLIST.SGLCATID' AND 'SALEGOODSLIST.SGLPPCODE' = \
        'SALEGOODSLIST.SGLPPCODE' AND 'VIEW_MFRAME_ALL.CLASS1' = 'VIEW_MFRAME_ALL.CLASS1' AND 'VIEW_MFRAME_ALL.SPBM' = \
        'VIEW_MFRAME_ALL.SPBM' AND 'SALEGOODSLIST.SGLSUPID' = 'SALEGOODSLIST.SGLSUPID' group by sglgdid, gbcname) where rank <= nvl('10', 10)",
        // 门店销售
        storeSales: `Select VIEW_MFRAME_ALL.CLASS1CNAME, Sum(TD.XSSR_DAY) XSSR_DAY, Sum(LD.TONG_WEEK) TONG_WEEK,
        Sum(LY.TONG_YEAR) TONG_YEAR From VIEW_MFRAME_ALL, (Select SCDMFID, Sum(XSSR + PFSR) XSSR_DAY, Sum(XSCBJML + PFCBJML) ML_DAY
        From SALECOSTDAY Where SALECOSTDAY.SCDDATE = trunc(Sysdate) Group By SCDMFID) TD, (Select SCDMFID, Sum(XSSR + PFSR) TONG_WEEK
        From SALECOSTDAY Where SALECOSTDAY.SCDDATE = Trunc(Sysdate - 7) Group By SCDMFID) LD, (Select SCDMFID, Sum(XSSR + PFSR) TONG_YEAR
        From SALECOSTDAY Where SALECOSTDAY.SCDDATE = trunc(add_months(Sysdate, -12)) Group By SCDMFID) LY Where VIEW_MFRAME_ALL.CLASS3 = TD.SCDMFID(+)
        And VIEW_MFRAME_ALL.CLASS3 = LD.SCDMFID(+) And VIEW_MFRAME_ALL.CLASS3 = LY.SCDMFID(+) And dbusrpub.fgetmframetype(VIEW_MFRAME_ALL.CLASS3) = '2'
        Group By VIEW_MFRAME_ALL.CLASS1CNAME HAVING(Sum(TD.XSSR_DAY) <> 0 OR Sum(TD.ML_DAY) <> 0 OR Sum(LD.TONG_WEEK) <> 0 OR Sum(LY.TONG_YEAR) <> 0)
        Order By 1`,
        // 门店毛利
        storeProfit: `Select VIEW_MFRAME_ALL.CLASS1CNAME, Sum(TD.ML_DAY) ML_DAY,
        Sum(LD.TONG_WEEK) TONG_WEEK, Sum(LY.TONG_YEAR) TONG_YEAR From VIEW_MFRAME_ALL, (Select SCDMFID, Sum(XSSR + PFSR) XSSR_DAY, Sum(XSCBJML + PFCBJML) ML_DAY
        From SALECOSTDAY Where SALECOSTDAY.SCDDATE = trunc(Sysdate) Group By SCDMFID) TD, (Select SCDMFID, Sum(XSCBJML + PFCBJML)  TONG_WEEK
        From SALECOSTDAY Where SALECOSTDAY.SCDDATE = Trunc(Sysdate - 7) Group By SCDMFID) LD, (Select SCDMFID, Sum(XSCBJML + PFCBJML) TONG_YEAR
        From SALECOSTDAY Where SALECOSTDAY.SCDDATE = trunc(add_months(Sysdate, -12)) Group By SCDMFID) LY Where VIEW_MFRAME_ALL.CLASS3 = TD.SCDMFID(+)
        And VIEW_MFRAME_ALL.CLASS3 = LD.SCDMFID(+) And VIEW_MFRAME_ALL.CLASS3 = LY.SCDMFID(+) And dbusrpub.fgetmframetype(VIEW_MFRAME_ALL.CLASS3) = '2'
        Group By VIEW_MFRAME_ALL.CLASS1CNAME HAVING(Sum(TD.XSSR_DAY) <> 0 OR Sum(TD.ML_DAY) <> 0 OR Sum(LD.TONG_WEEK) <> 0 OR Sum(LY.TONG_YEAR) <> 0)
        Order By 1`,
        // 销售地点
        saleMap: 'select * from bi_map_order',
        // 公告栏
        noticeBoard: "select '['||subject||']'||content From USR_W_NOTIFICATION where senddate>Trunc(sysdate)"
    }
};

// oracleClient.prototype.run = function(sql, prarmeter, cb) {
//   oracle.getConnection(this.config, function(err, connection) {
//     if (err) {
//       logger.error('cant create oracle connection: [%s]', err.message);
//       return cb(null, null);
//     }
//     connection.execute(sql, prarmeter, function (err, result) {
//       if (err) {
//         logger.error('execute sql failed: %s', err.message);
//         return cb(null, null);
//       }
//       connection.close(function (err) {
//         if (err) {
//           logger.error('close connection failed: %s', err.message);
//         }
//           return cb(null, result.rows);
//       });
//     });
//   });
// };

oracleClient.prototype.getConnection = function(cb) {
    oracle.getConnection(this.config, function(err, connection) {
        if (err) {
            logger.error('cant create oracle connection: [%s]', err.message);
            return cb(null, null);
        }
        return cb(null, connection);
        })
};


module.exports = oracleClient;
