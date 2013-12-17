package com.alibaba.oceanbase.obconfig.controller;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.alibaba.oceanbase.obconfig.dao.JarDAO;
import com.alibaba.oceanbase.obconfig.entity.JarDO;
import com.alibaba.oceanbase.obconfig.util.MD5Calculator;
import com.alibaba.oceanbase.obconfig.util.UrlPatternConstants;

/**
 * 
 * 
 * @author liangjieli
 * @version $Id: ConfigController.java, v 0.1 Feb 18, 2013 2:34:30 PM liangjieli Exp $
 */
@Controller
@Scope(value = BeanDefinition.SCOPE_SINGLETON)
@Transactional(rollbackFor = Exception.class, isolation = Isolation.DEFAULT, propagation = Propagation.REQUIRED)
public class JarManageController {

    public static final String FILE_CONTENT_TYPE = "application/octet-stream";

    @Autowired
    private JarDAO             jarDAO;

    @RequestMapping(value = UrlPatternConstants.JAR_LIST, method = RequestMethod.GET)
    public ModelAndView jarRepo(@RequestParam(value = "result", required = false) String result,
                                ModelAndView mav) {

        List<JarDO> list = jarDAO.findAll();
        mav.addObject("list", list);
        mav.addObject("result", result);
        mav.setViewName(UrlPatternConstants.JAR_LIST);

        return mav;
    }

    @RequestMapping(value = UrlPatternConstants.JAR_LIST_VERSION, method = RequestMethod.GET)
    public void jarVersion(HttpServletResponse response) throws IOException {
        List<String> allVersion = this.jarDAO.findAllVersion();

        response.setContentType("application/json");
        if (allVersion != null) {
            response.getWriter().print(JSONArray.fromObject(allVersion).toString());
        }
        response.getWriter().println();
    }

    @RequestMapping(value = UrlPatternConstants.JAR_GET, method = RequestMethod.GET)
    public void jarInsert(@RequestParam(value = "id", required = false) Integer id,
                          @RequestParam(value = "version", required = false) String version,
                          HttpServletResponse response) throws IOException {
        if (id == null) {
            id = 0;
        }

        JarDO jarDO = this.jarDAO.findById(id);

        if (jarDO == null) {
            jarDO = this.jarDAO.findByVersion(version);
        }

        response.setContentType(FILE_CONTENT_TYPE);
        response.setHeader("Content-Disposition", "attachment; filename=" + jarDO.getJarFileName());
        response.setContentLength(jarDO.getJarFile().length);
        response.getOutputStream().write(jarDO.getJarFile());
        response.getOutputStream().flush();
    }

    @RequestMapping(value = UrlPatternConstants.JAR_ADD, method = RequestMethod.GET)
    public ModelAndView jarInsert(@RequestParam(value = "id", required = false) Integer id,
                                  ModelAndView mav) {
        if (id == null) {
            id = 0;
        }

        if (id > 0) {
            JarDO jarDO = this.jarDAO.findById(id);
            mav.addObject("jarDO", jarDO);
        }
        mav.setViewName(UrlPatternConstants.JAR_ADD);
        return mav;
    }

    @RequestMapping(value = UrlPatternConstants.JAR_DELETE, method = RequestMethod.GET)
    public ModelAndView jarDelete(@RequestParam(value = "id", required = false) Integer id,
                                  ModelAndView mav) {

        if (id == null) {
            id = 0;
        }

        if (id > 0) {
            mav.addObject("result", this.jarDAO.deleteById(id));
        }

        RedirectView rv = new RedirectView(UrlPatternConstants.JAR_LIST);
        mav.setView(rv);
        mav.setView(rv);

        return mav;
    }

    @RequestMapping(value = UrlPatternConstants.JAR_ADD, method = RequestMethod.POST)
    public ModelAndView doJarInsert(@RequestParam("version") String version,
                                    @RequestParam("id") Integer id,
                                    @RequestParam("jarFile") MultipartFile file, ModelAndView mav)
                                                                                                  throws IOException,
                                                                                                  ClassNotFoundException,
                                                                                                  NoSuchAlgorithmException {

        if (id == null) {
            id = 0;
        }

        if ((file != null && FILE_CONTENT_TYPE.equals(file.getContentType()) && file
            .getOriginalFilename().endsWith(".jar"))
            || StringUtils.isBlank(file.getOriginalFilename())) {

            JarDO jarDO = new JarDO();
            jarDO.setVersion(version);
            jarDO.setCreateTime(new Date());
            jarDO.setJarFile(file.getBytes());
            jarDO.setChecksum(MD5Calculator.calcuateJarFromBytes(file.getBytes()));
            jarDO.setId(id);
            jarDO.setJarFileName(file.getOriginalFilename());

            mav.addObject("result", jarDAO.saveOrUpdate(jarDO));
        }

        RedirectView rv = new RedirectView(UrlPatternConstants.JAR_LIST);
        mav.setView(rv);
        mav.setView(rv);

        return mav;
    }

}
