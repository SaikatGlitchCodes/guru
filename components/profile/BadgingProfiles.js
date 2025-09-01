import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';
import React from 'react'
import { getBadgeInfo } from './profileUtils';

export default function BadgingProfiles({ rating }) {
    return (
        <TooltipProvider>
            <div className="flex flex-col items-center space-y-2">
                {(() => {
                    const badgeInfo = getBadgeInfo(rating || 0);
                    const IconComponent = badgeInfo.icon;
                    return (
                        <div className="flex flex-col items-center space-y-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${badgeInfo.color} shadow-lg cursor-help transition-transform hover:scale-105`}>
                                        <IconComponent className="h-4 w-4" />
                                        <span className="text-sm font-semibold">{badgeInfo.title}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-xs">
                                    <p className="text-center">{badgeInfo.tooltip}</p>
                                </TooltipContent>
                            </Tooltip>
                            <p className="text-xs text-muted-foreground text-center">
                                {badgeInfo.description}
                            </p>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center space-x-1 text-xs text-muted-foreground cursor-help">
                                        <span>Rating: {rating ? rating.toFixed(1) : 'N/A'}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>
                                        {rating
                                            ? `Current rating: ${rating.toFixed(1)}/5.0 stars based on student feedback`
                                            : 'No ratings yet - complete your first tutoring session to receive ratings'
                                        }
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    );
                })()}
            </div>
        </TooltipProvider>
    )
}
