package com.tientoan21.WebMovie.mapper;

import com.tientoan21.WebMovie.dto.reponse.UserReponse;
import com.tientoan21.WebMovie.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserReponse toUserReponse(User user);
}
