package com.example.shodh_ai_contest_backend.controller;

/*import com.shodhaicode.model.Contest;
import com.shodhaicode.service.ContestService;
*/
import com.example.shodh_ai_contest_backend.model.Contest;
import com.example.shodh_ai_contest_backend.service.ContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")
public class ContestController {

    @Autowired
    private ContestService contestService;

    @GetMapping
    public List<Contest> list() {
        return contestService.findAll();
    }

    @GetMapping("/{id}")
    public Contest get(@PathVariable("id") Long id) {
        return contestService.findById(id)
                .orElseThrow(() -> new RuntimeException("Contest not found"));
    }
}
