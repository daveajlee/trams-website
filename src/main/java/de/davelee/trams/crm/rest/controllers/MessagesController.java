package de.davelee.trams.crm.rest.controllers;

import de.davelee.trams.crm.model.Message;
import de.davelee.trams.crm.response.MessageResponse;
import de.davelee.trams.crm.response.MessagesResponse;
import de.davelee.trams.crm.services.MessageService;
import de.davelee.trams.crm.utils.DateUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * This class defines the endpoints for the REST API which manipulate messages and delegates the actions to the MessageService class.
 * @author Dave Lee
 */
@RestController
@Api(value="/trams-crm/messages")
@RequestMapping(value="/trams-crm/messages")
public class MessagesController {

    @Autowired
    private MessageService messageService;

    /**
     * Endpoint to retrieve messages for a particular company and optionally for a particular folder and/or
     * optionally for a sender and/or optionally for a date.
     * @param company a <code>String</code> containing the name of the company to search for.
     * @param folder a <code>String</code> containing the folder to search for (optional).
     * @param sender a <code>String</code> containing the sender to search for (optional).
     * @param date a <code>String</code> containing the date to search for (optional).
     * @return a <code>MessagesResponse</code> object which may be null if there are no messages found.
     */
    @GetMapping("/")
    @ResponseBody
    @ApiOperation(value = "Get messages", notes="Return all messages matching company and if supplied folder, sender and date")
    @ApiResponses(value = {@ApiResponse(code=200,message="Successfully returned messages"), @ApiResponse(code=204,message="Successful but no messages found")})
    public ResponseEntity<MessagesResponse> getMessages (final String company, final Optional<String> folder, final Optional<String> sender, final Optional<String> date ) {
        //First of all, check if the company field is empty or null, then return bad request.
        if (StringUtils.isBlank(company)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        //Retrieve the messages.
        List<Message> messages = messageService.getMessagesByCompany(company, folder, sender, date);
        //If messages is null or empty then return 204.
        if ( messages == null || messages.size() == 0 ) {
            return ResponseEntity.noContent().build();
        }
        //Otherwise convert to messages response and return.
        MessageResponse[] messageResponses = new MessageResponse[messages.size()];
        for ( int i = 0; i < messageResponses.length; i++ ) {
            messageResponses[i] = MessageResponse.builder()
                    .company(messages.get(i).getCompany())
                    .dateTime(DateUtils.convertLocalDateToDate(messages.get(i).getDateTime()))
                    .subject(messages.get(i).getSubject())
                    .text(messages.get(i).getText())
                    .sender(messages.get(i).getSender())
                    .folder(messages.get(i).getFolder())
                    .build();
        }
        return ResponseEntity.ok(MessagesResponse.builder()
                .count((long) messageResponses.length)
                .messageResponses(messageResponses).build());
    }

    /**
     * Delete all messages for the specified company that are currently stored in the database.
     * @param company a <code>String</code> containing the name of the company to delete messages for.
     */
    @DeleteMapping("/")
    @ApiOperation(value = "Delete messages", notes="Delete all messages")
    @ApiResponses(value = {@ApiResponse(code=200,message="Successfully deleted messages"),@ApiResponse(code=204,message="Successful but no messages found")})
    public ResponseEntity<Void> deleteMessagesByCompany (final String company ) {
        //First of all, check if the company field is empty or null, then return bad request.
        if (StringUtils.isBlank(company)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        //Retrieve the messages for this company.
        List<Message> messages = messageService.getMessagesByCompany(company, Optional.empty(), Optional.empty(), Optional.empty());
        //If messages is null or empty then return 204.
        if ( messages == null || messages.size() == 0 ) {
            return ResponseEntity.noContent().build();
        }
        //Otherwise delete all messages and return.
        for ( Message message : messages ) {
            messageService.deleteMessage(message);
        }
        return ResponseEntity.ok().build();
    }

}
