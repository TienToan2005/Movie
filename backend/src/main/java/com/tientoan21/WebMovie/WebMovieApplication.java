package com.tientoan21.WebMovie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WebMovieApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebMovieApplication.class, args);
	}

}
