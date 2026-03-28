package com.talosgym.talos_gym.common.repository;

import jakarta.persistence.criteria.From;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

public final class SpecificationUtils {

    private SpecificationUtils() {
        // Utility class
    }

    /**
     * Belirtilen attribute için mevcut bir JOIN varsa onu döndürür, yoksa yeni bir JOIN oluşturur.
     * <p>
     * Bu metot, dinamik sorgularda (Specification) aynı ilişkiye (relation) birden fazla kez
     * JOIN yapılmasını önleyerek sorgu performansını optimize eder ve SQL karmaşıklığını azaltır.
     * </p>
     *
     * <p><strong>Kullanım Senaryoları:</strong></p>
     * <ul>
     *   <li>{@code @EntityGraph} ile tetiklenen {@code JOIN FETCH} işlemlerinde mevcut join'i yakalayarak filtreleme amacıyla kullanır.</li>
     *   <li>Birden fazla Specification metodunun aynı tabloya ihtiyaç duyduğu durumlarda (örn. hem Kitap Adı hem ISBN filtresi),
     *       mükerrer JOIN oluşumunu engeller.</li>
     * </ul>
     *
     * <p><em>Not: Modern Hibernate sürümleri join optimizasyonunu genellikle otomatik yapsa da,
     * karmaşık Criteria sorgularında bu kontrolü manuel yapmak daha güvenli bir yaklaşımdır.</em></p>
     *
     * @param from          Join işleminin başlatılacağı kaynak (Root veya başka bir Join)
     * @param attributeName Join yapılacak ilişkinin (attribute) ismi
     * @param joinType      Join tipi (INNER, LEFT, RIGHT)
     * @param <X>           Kaynak entity tipi
     * @param <Y>           Hedef entity tipi
     * @return Mevcut veya yeni oluşturulan Join nesnesi
     */
    @SuppressWarnings("unchecked")
    public static <X, Y> Join<X, Y> getOrCreateJoin(From<?, X> from, String attributeName, JoinType joinType) {
        for (Join<?, ?> join : from.getJoins()) {
            if (join.getAttribute().getName().equals(attributeName)) {
                return (Join<X, Y>) join;
            }
        }
        return from.join(attributeName, joinType);
    }
}