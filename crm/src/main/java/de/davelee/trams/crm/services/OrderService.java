package de.davelee.trams.crm.services;

import de.davelee.trams.crm.model.Order;
import de.davelee.trams.crm.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Class to provide service operations for orders in TraMS CRM.
 * @author Dave Lee
 */
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Save the specified order object in the database.
     * @param order a <code>Order</code> object to save in the database.
     * @return a <code>boolean</code> which is true iff the order could be saved successfully.
     */
    public boolean save(final Order order) {
        return orderRepository.save(order) != null;
    }


}
