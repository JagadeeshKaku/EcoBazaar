package com.ecobazaar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Seller products
    List<Product> findBySeller(User seller);

    // 🔥 ADMIN (pending only + active)
    List<Product> findByApprovedFalseAndActiveTrue();

    // 🔥 USER (approved + active)
    Page<Product> findByApprovedTrueAndActiveTrue(Pageable pageable);

    // 🔥 FILTERS (ALL MUST INCLUDE active + approved)
    Page<Product> findByNameIgnoreCaseAndApprovedTrueAndActiveTrue(String name, Pageable pageable);

    Page<Product> findByEcoCertifiedAndApprovedTrueAndActiveTrue(Boolean ecoCertified, Pageable pageable);

    Page<Product> findByPriceBetweenAndApprovedTrueAndActiveTrue(Double minPrice, Double maxPrice, Pageable pageable);
    
    //User findByEmail(String email);
    
    List<Product> findByActiveTrue();
    
    List<Product> findBySeller_Email(String email);
  
  List<Product> findByApprovedFalse();
  List<Product> findByApprovedTrue();
  Page<Product> findByApprovedTrue(Pageable pageable);
  Page<Product> findByEcoCertified(Boolean ecoCertified, Pageable pageable);

  Page<Product> findByNameIgnoreCase(String name, Pageable pageable);
  Page<Product> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);
  Page<Product> findByApproved(Boolean approved, Pageable pageable);
  Page<Product> findByActiveTrue(Pageable pageable);
  Page<Product> findByActiveTrueAndApprovedTrue(Pageable pageable);
  Page<Product> findAllByOrderByEcoScoreDesc(Pageable pageable);
  
//  List<Product> findByApprovedFalseAndActiveTrue();
//
//  Page<Product> findByApprovedTrueAndActiveTrue(Pageable pageable);
//
//  Page<Product> findByNameIgnoreCaseAndApprovedTrueAndActiveTrue(String name, Pageable pageable);
//
//  Page<Product> findByEcoCertifiedAndApprovedTrueAndActiveTrue(Boolean ecoCertified, Pageable pageable);
//
//  Page<Product> findByPriceBetweenAndApprovedTrueAndActiveTrue(Double minPrice, Double maxPrice, Pageable pageable);
  
//  Page<Product> findByApprovedTrue(Pageable pageable);

  Page<Product> findByNameIgnoreCaseAndApprovedTrue(String name, Pageable pageable);

  Page<Product> findByEcoCertifiedAndApprovedTrue(Boolean ecoCertified, Pageable pageable);
  
  List<Product> findTop5ByEcoScoreGreaterThanOrderByEcoScoreDesc(Double ecoScore);

  Page<Product> findByPriceBetweenAndApprovedTrue(Double minPrice, Double maxPrice, Pageable pageable);
  
  List<Product> findByEcoScoreGreaterThanAndApprovedTrue(Double ecoScore);
}
//package com.ecobazaar.repository;
//
//import java.util.List;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import com.ecobazaar.entity.Product;
//import com.ecobazaar.entity.User;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//
//
//@Repository
//public interface ProductRepository extends JpaRepository<Product, Long> {
//	
////	 User findByEmail(String email);
//    // For seller → view only their products
//    List<Product> findBySeller(User seller);
//    List<Product> findByApprovedFalse();
//    List<Product> findByApprovedTrue();
//    Page<Product> findByApprovedTrue(Pageable pageable);
//    Page<Product> findByEcoCertified(Boolean ecoCertified, Pageable pageable);
//
//    Page<Product> findByNameIgnoreCase(String name, Pageable pageable);
//    Page<Product> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);
//    Page<Product> findByApproved(Boolean approved, Pageable pageable);
//    Page<Product> findByActiveTrue(Pageable pageable);
//    Page<Product> findByActiveTrueAndApprovedTrue(Pageable pageable);
//    Page<Product> findAllByOrderByEcoScoreDesc(Pageable pageable);
//    
//    List<Product> findByApprovedFalseAndActiveTrue();
//
//    Page<Product> findByApprovedTrueAndActiveTrue(Pageable pageable);
//
//    Page<Product> findByNameIgnoreCaseAndApprovedTrueAndActiveTrue(String name, Pageable pageable);
//
//    Page<Product> findByEcoCertifiedAndApprovedTrueAndActiveTrue(Boolean ecoCertified, Pageable pageable);
//
//    Page<Product> findByPriceBetweenAndApprovedTrueAndActiveTrue(Double minPrice, Double maxPrice, Pageable pageable);
//    
////    Page<Product> findByApprovedTrue(Pageable pageable);
//
//    Page<Product> findByNameIgnoreCaseAndApprovedTrue(String name, Pageable pageable);
//
//    Page<Product> findByEcoCertifiedAndApprovedTrue(Boolean ecoCertified, Pageable pageable);
//
//    Page<Product> findByPriceBetweenAndApprovedTrue(Double minPrice, Double maxPrice, Pageable pageable);
//}