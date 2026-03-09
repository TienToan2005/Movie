package com.tientoan21.WebMovie.mapper;

import com.tientoan21.WebMovie.dto.response.UserResponse;
import com.tientoan21.WebMovie.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toUserReponse(User user);
}
