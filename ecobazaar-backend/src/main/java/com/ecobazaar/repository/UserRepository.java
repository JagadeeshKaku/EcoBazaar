package com.ecobazaar.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ecobazaar.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
//	User findByEmail(String email);
    Optional<User> findByEmail(String email);
}